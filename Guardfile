require 'pry'
guard 'rspec', cmd: 'bundle exec rspec' do

  # watch /utils/ files
  watch(%r{^utils/(.+)\.rb$}) do |m|
    "spec/utils/#{m[1]}_spec.rb"
  end

  # watch('utils/weapon_extractor.rb') do |m|
  #   "spec/utils/weapon_extractor_spec.rb"
  # end

  # watch /spec/ files
  watch(%r{^spec/(.+).rb$}) do |m|
    "spec/#{m[1]}.rb"
  end

end

