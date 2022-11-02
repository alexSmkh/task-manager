class Web::PasswordResetsController < Web::ApplicationController
  def create
    @password_reset_form = PasswordResetForm.new(password_reset_params)

    return render('web/passwords/new') if @password_reset_form.invalid?

    user = @password_reset_form.user

    PasswordResetService.create_password_reset_token!(user)

    SendPasswordResetInstructionsJob.perform_async(user.email, user.reset_token)

    redirect_to(root_path, alert: 'An email has been sent to you with instructions')
  end

  def update
    @new_password_form = NewPasswordForm.new(password_params)

    if @new_password_form.invalid?
      errors = @new_password_form.errors

      return render('web/passwords/edit') if errors.where(:password).present?

      return redirect_to(new_password_path, alert: errors.where(:reset_token).first.message)
    end

    user = @new_password_form.user
    user.update(password_params.slice(:password, :password_confirmation))
    PasswordResetService.delete_password_reset_token!(user)
    redirect_to(new_session_path, alert: 'Your password was reset successfully! Please sign in.')
  end

  private

  def password_reset_params
    params.require(:password_reset_form).permit(:email)
  end

  def password_params
    params.require(:new_password_form).permit(:password, :password_confirmation, :reset_token)
  end
end
