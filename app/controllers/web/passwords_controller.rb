class Web::PasswordsController < Web::ApplicationController
  def new
    @password_reset_form = PasswordResetForm.new
  end

  def edit
    @new_password_form = NewPasswordForm.new(reset_token: params[:token])

    unless @new_password_form.token_valid?
      redirect_to(new_password_path, alert: @new_password_form.errors.where(:reset_token).first.message)
    end
  end
end
