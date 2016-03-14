#!/usr/bin/env ruby
require "rubygems"
require "json"

elements = ["chitipa", "karonga", "rumphi", "mzimba", "nkhatabay", "nkhotakota", "salima", "kasungu", "dedza",
            "lilongwe", "ntchisi", "ntcheu", "mchinji", "dowa", "balaka", "zomba", "machinga", "blantyre", "machinga",
            "chiradzulu", "chikwawa", "nsanje", "neno", "mwanza", "phalombe", "mulanje", "likoma", "thyolo", "mangochi",
            "zone_c_east", "zone_c_west", "zone_northern", "zone_s_east", "zone_s_west"]

districts = JSON.parse(File.open("./districts.json").read) rescue {}

result = {}

elements.each do |element|

  if(File.exist?("./#{element}.svg"))

    File.open("./#{element}.svg").readlines.each do |line|

      if line.match(/viewBox/)

        sx, sy, ex, ey = /(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]+(\d+)/.match(line).captures

        puts "#{element}: (#{sx}, #{sy}, #{ex}, #{ey})"

        result[element] = {
            "sx" => sx,
            "sy" => sy,
            "ex" => ex,
            "ey" => ey,
            "lat" => (districts[element]["latitude"] rescue nil),
            "lon" => (districts[element]["longitude"] rescue nil)
        }

        break

      end

    end

  end

end

file = File.open("./result.json", "w")

file.write(result.to_json)

file.close