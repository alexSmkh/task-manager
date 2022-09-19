ENV['RAILS_ENV'] ||= 'test'

require 'coveralls'
require 'simplecov'

require_relative '../config/environment'
require 'rails/test_help'

if ENV['COVERAGE']
  SimpleCov.formatter = Coveralls::SimpleCov::Formatter
end

SimpleCov.start('rails')

class ActiveSupport::TestCase
  include ActionMailer::TestHelper
  include FactoryBot::Syntax::Methods
  include AuthHelper

  fixtures :all
end
