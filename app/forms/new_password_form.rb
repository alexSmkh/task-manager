class NewPasswordForm
  include ActiveModel::Model
  include ActiveModel::SecurePassword

  has_secure_password
end
