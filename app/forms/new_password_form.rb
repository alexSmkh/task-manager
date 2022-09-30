class NewPasswordForm
  include ActiveModel::Model
  include ActiveModel::SecurePassword

  attr_accessor :reset_token, :password_digest, :password_digest_confirmation

  has_secure_password

  def user
    @user ||= User.find_by(reset_token: reset_token)
  end

  def token_invalid?
    if user.nil?
      errors.add(:reset_token, 'Reset link has invalid')
    elsif PasswordResetService.password_reset_token_expired?(user)
      errors.add(:reset_token, 'Reset link has expired')
    end
  end
end
