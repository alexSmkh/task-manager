FactoryBot.define do
  factory :task do
    name { generate :string }
    description { generate :string }
    author { create(:user) }
    assignee { create(:user) }
  end
end
