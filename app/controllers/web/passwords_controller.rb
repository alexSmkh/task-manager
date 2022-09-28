class Web::PasswordsController < Web::ApplicationController
  def new
    @password_reset_form = PasswordResetForm.new
  end

  def edit
    @token = params[:token]

    user = @token.present? && User.find_by(reset_token: @token)

    if user.blank?
      redirect_to(new_password_path, alert: 'Your reset link is invalid.')
    elsif user.password_reset_token_expired?
      redirect_to(new_password_path, alert: 'Your reset link has expired.')
    end

    @new_password_form = NewPasswordForm.new
  end
end
