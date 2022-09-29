class PasswordResetForm
  include ActiveModel::Model

  attr_accessor :email

  validates :email, presence: true, format: { with: /\A\S+@.+\.\S+\z/ }
  validate :user_exists?

  def request_password_reset_instructions
    return false if invalid?

    user.create_password_reset_token

    UserMailer.with(user: user).password_reset.deliver_now
  end

  private

  def user
    @user ||= User.find_by(email: email)
  end

  def user_exists?
    if user.nil?
      errors.add(:email, 'User with this email does not exist')
      return false
    end
    true
  end
end
