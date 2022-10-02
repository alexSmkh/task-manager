source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.1'

gem 'rails', '~> 6.1.4', '>= 6.1.4.1'

gem 'active_model_serializers'
gem 'bcrypt', '~> 3.1.7'
gem 'bootsnap', '>= 1.4.4', require: false
gem 'jbuilder', '~> 2.7'
gem 'js-routes'
gem 'kaminari'
gem 'newrelic_rpm'
gem 'pg', '~> 1.1'
gem 'puma', '~> 5.0'
gem 'ransack', github: 'activerecord-hackery/ransack', branch: 'main'
gem 'responders'
gem 'rollbar'
gem 'sass-rails', '>= 6'
gem 'sidekiq'
gem 'sidekiq-throttled'
gem 'simple_form'
gem 'slim-rails'
gem 'state_machines'
gem 'state_machines-activerecord'
gem 'webpacker', '~> 5.0'
gem 'webpacker-react', '~> 0.3.2'

group :development, :test do
  gem 'bullet'
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'factory_bot_rails'
  gem 'rubocop'
  gem 'sidekiq-failures'
end

group :development do
  gem 'letter_opener'
  gem 'letter_opener_web'
  gem 'listen', '~> 3.3'
  gem 'rack-mini-profiler', '~> 2.0'
  gem 'web-console', '>= 4.1.0'
end

group :test do
  gem 'capybara', '>= 3.26'
  gem 'coveralls_reborn', '~> 0.25.0', require: false
  gem 'selenium-webdriver'
  gem 'simplecov', require: false
  gem 'webdrivers'
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
