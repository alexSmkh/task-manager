ENV['RAILS_ENV'] ||= 'test'

require 'coveralls'
require 'simplecov'

require_relative '../config/environment'
require 'rails/test_help'

SimpleCov.Formatter = Coveralls::SimpleCov::Formatter
SimpleCov.start('rails')

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods
  include AuthHelper

  parallelize(workers: :number_of_processors)

  fixtures :all
end
