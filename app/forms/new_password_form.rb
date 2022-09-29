class NewPasswordForm
  include ActiveModel::Model
  include ActiveModel::SecurePassword

  attr_accessor :reset_token, :password_digest, :password_digest_confirmation

  has_secure_password

  validate :token_valid?

  def update_password(password_params)
    return false if invalid?

    user.update(password_params)
    PasswordResetService.delete_password_reset_token(user)
  end

  def token_valid?
    if user.nil?
      errors.add(:reset_token, 'Reset link has invalid')
      return false
    elsif PasswordResetService.password_reset_token_expired?(user)
      errors.add(:reset_token, 'Reset link has expired')
      return false
    end
    true
  end

  private

  def user
    @user ||= User.find_by(reset_token: reset_token)
  end
end
