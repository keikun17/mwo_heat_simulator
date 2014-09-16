Dir[Dir.pwd + "/utils/**/*.rb"].each { |f| require f }


require 'rspec/collection_matchers'

require 'pry'
require 'mwo'
require 'vcr'

VCR.configure do |vcr|
  vcr.cassette_library_dir = 'fixtures/cassettes'
  vcr.default_cassette_options = {record: :once}
  vcr.configure_rspec_metadata!
  vcr.hook_into :webmock
end

RSpec.configure do |config|
  config.color = true
  config.tty = true
  config.failure_color = :magenta
end

