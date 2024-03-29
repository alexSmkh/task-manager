class Task < ApplicationRecord
  belongs_to :author, class_name: 'User'
  belongs_to :assignee, class_name: 'User', optional: true

  has_one_attached :image
  with_attached_image

  validates :name, presence: true
  validates :description, presence: true, length: { maximum: 500 }
  validates :author, presence: true

  state_machine initial: :new_task do
    event :to_development do
      transition [:new_task, :in_qa, :in_code_review] => :in_development
    end

    event :archive do
      transition [:new_task, :released] => :archived
    end

    event :to_qa do
      transition in_development: :in_qa
    end

    event :to_code_review do
      transition in_qa: :in_code_review
    end

    event :prepare_for_release do
      transition in_code_review: :ready_for_release
    end

    event :release do
      transition ready_for_release: :released
    end
  end
end
