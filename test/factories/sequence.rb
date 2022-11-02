FactoryBot.define do
  sequence :string, aliases: [:first_name, :last_name, :password, :name, :description, :text] do |n|
    "string#{n}"
  end

  sequence(:email) { |n| "test#{n}@example.com" }
end
