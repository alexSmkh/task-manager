FactoryBot.define do
  factory :admin do
    type { 'Admin' }
    first_name { generate :string }
    last_name { generate :string }
    email
    password { generate :string }
  end
end
