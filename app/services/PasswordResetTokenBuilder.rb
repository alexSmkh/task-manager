module PasswordResetTokenBuilder
  def self.generate_token
    SecureRandom.urlsafe_base64
  end

  def self.create_password_reset_token(user)
    user.reset_token = generate_token
    user.reset_token_expires_at = 24.hours.from_now
    user.save
  end

  def self.delete_password_reset_token(user)
    user.reset_token = nil
    user.reset_token_expires_at = nil
    user.save
  end
end
