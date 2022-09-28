class Web::PasswordResetsController < Web::ApplicationController
  def create
    password_reset_form = PasswordResetForm.new(password_reset_params)
    user = User.find_by(email: password_reset_form.email)

    if user.present?
      user.create_password_reset_token
      UserMailer.with(user: user).password_reset.deliver_now
      redirect_to(root_path, alert: 'Email sent with instructions')
    else
      redirect_to(new_session_path, alert: 'User with this email does not exist')
    end
  end

  def update
    token = params[:token]

    user = token.present? && User.find_by(reset_token: params[:token])

    if user.present? && !user.password_reset_token_expired? && user.update(password_params)
      user.delete_password_reset_token
      redirect_to(new_session_path, alert: 'Your password was reset successfully! Please sign in.')
    else
      redirect_to(new_password_path, alert: 'Something was wrong. Please try again')
    end
  end

  private

  def password_reset_params
    params.require(:password_reset_form).permit(:email)
  end

  def password_params
    params.require(:new_password_form).permit(:password, :password_confirmation)
  end
end
