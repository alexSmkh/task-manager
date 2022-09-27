class NewPasswordForm
  include ActiveModel::Model

  validates :password, presence: true
  validates :password_confirmation, presence: true
  validate :same?

  private

  def same?
    if password != password_confirmation
      errors.add(:password, 'Passwords doesn\'t match')
    end
  end
end
