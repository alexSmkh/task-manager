class PasswordResetForm
  include ActiveModel::Model

  attr_accessor :email

  validates :email, presence: true, format: { with: /\A\S+@.+\.\S+\z/ }
  validate :user_exists?

  def user
    @user ||= User.find_by(email: email)
  end

  private

  def user_exists?
    return errors.add(:email, 'User with this email does not exist') if user.nil?
  end
end
