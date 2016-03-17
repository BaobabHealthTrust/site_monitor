require "rss"
require "json"

class RssController < ActionController::Base

  def feed

    max_age = 60 * 60 # 1 hour

    root = "#{Rails.root}/public/"

    filename = "#{root}data/site.json"

    results = {}

    if !File.file?(filename)

      Encounter.find_by_sql("SELECT DATE(encounter_datetime) AS encounter_datetime, count(DISTINCT(patient_id)) AS " +
                                "patient_id FROM encounter where YEAR(encounter_datetime) = YEAR(NOW()) " +
                                " group by DATE(encounter_datetime) order by count(DISTINCT(patient_id)) desc LIMIT " +
                                "50000000").each do |encounter|

        encounter_datetime = encounter.encounter_datetime.to_date

        month = encounter_datetime.strftime("%m")

        date = encounter_datetime.strftime("%d")

        results[encounter_datetime.year] = {} if !results[encounter_datetime.year]

        results[encounter_datetime.year][month] = {} if !results[encounter_datetime.year][month]

        results[encounter_datetime.year][month][date] = encounter.patient_id

      end

      if !File.exist?("#{root}data")

        Dir.mkdir("#{root}data")

      end

      file = File.open(filename, "w+")

      file.write(results.to_json)

      file.close

    elsif ((Time.now - File.ctime(filename)) > max_age)

      Encounter.find_by_sql("SELECT DATE(encounter_datetime) AS encounter_datetime, count(DISTINCT(patient_id)) AS " +
                                "patient_id FROM encounter where YEAR(encounter_datetime) = YEAR(NOW()) " +
                                " group by DATE(encounter_datetime) order by count(DISTINCT(patient_id)) desc LIMIT " +
                                "50000000").each do |encounter|

        encounter_datetime = encounter.encounter_datetime.to_date

        month = encounter_datetime.strftime("%m")

        date = encounter_datetime.strftime("%d")

        results[encounter_datetime.year] = {} if !results[encounter_datetime.year]

        results[encounter_datetime.year][month] = {} if !results[encounter_datetime.year][month]

        results[encounter_datetime.year][month][date] = encounter.patient_id

      end

      if !File.exist?("#{root}data")

        Dir.mkdir("#{root}data")

      end

      file = File.open(filename, "w+")

      file.write(results.to_json)

      file.close

    else

      results = JSON.parse(File.open(filename, "r").read) rescue {}

    end

    # raise results.to_yaml

    timestamp = File.ctime(filename)

    rss = RSS::Maker.make("atom") do |maker|
      maker.channel.author = "Baobab Health Trust Site Monitoring Feed"
      maker.channel.updated = Time.now.to_s
      # maker.channel.about = "http://www.ruby-lang.org/en/feeds/news.rss"
      maker.channel.about = "Site monitoring"
      maker.channel.title = "Patient Attendance Statistics"

      if results.keys.length > 0

        year = results.keys[0]

        months = results[year].keys

        (0..(months.length - 1)).each do |i|

          month = months[i]

          dates = results[year][month].keys

          (0..(dates.length - 1)).each do |j|

            date = dates[j]

            maker.items.new_item do |item|
              item.id = "#{year}-#{month}-#{date}"
              item.title = "#{year}-#{month}-#{date}:#{results[year][month][date]}"
              item.updated = timestamp.to_s
            end

          end

        end

      end

    end

    respond_to do |format|
      format.rss { render :text => rss.to_s }
      format.atom { render :xml => rss.to_xml }
    end

  end

end
