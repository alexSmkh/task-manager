class Web::PasswordResetsController < Web::ApplicationController
  def create
    @password_reset_form = PasswordResetForm.new(password_reset_params)

    if @password_reset_form.valid? && @password_reset_form.request_password_reset_instructions
      redirect_to(root_path, alert: 'An email has been sent to you with instructions')
    else
      render('web/password/new')
    end
  end

  def update
    @new_password_form = NewPasswordForm.new(password_params)

    if @new_password_form.invalid?
      redirect_to(new_password_path)
    else
      @new_password_form.update_password(password_params.except(:reset_token))
      redirect_to(new_session_path, alert: 'Your password was reset successfully! Please sign in.')
    end
  end

  private

  def password_reset_params
    params.require(:password_reset_form).permit(:email)
  end

  def password_params
    params.require(:new_password_form).permit(:password, :password_confirmation, :reset_token)
  end
end
