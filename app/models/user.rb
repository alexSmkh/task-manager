class User < ApplicationRecord
  has_secure_password

  has_many :my_tasks, class_name: 'Task', foreign_key: :author_id
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assignee_id

  validates :first_name, presence: true, length: { minimum: 2 }
  validates :last_name, presence: true, length: { minimum: 2 }
  validates :email,
            presence: true,
            uniqueness: true,
            format: { with: URI::MailTo::EMAIL_REGEXP }

  def create_password_reset_token
    self.reset_token = SecureRandom.urlsafe_base64
    self.reset_token_expiration = 24.hours.from_now
    save
  end

  def delete_password_reset_token
    self.reset_token = nil
    self.reset_token_expiration = nil
    save
  end

  def password_reset_token_expired?
    Time.zone.now.after?(reset_token_expiration)
  end
end
