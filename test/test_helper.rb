ENV['RAILS_ENV'] ||= 'test'

require 'simplecov'

require_relative '../config/environment'
require 'rails/test_help'

SimpleCov.start('rails')

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods
  include AuthHelper

  parallelize(workers: :number_of_processors)

  fixtures :all
end
