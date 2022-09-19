require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

if ['development', 'production'].include? ENV['RAILS_ENV']
  Dotenv::Railtie.load
end

module TaskManager
  class Application < Rails::Application
    config.load_defaults 6.1

    config.assets.paths << Rails.root.join('node_modules')
  end
end
