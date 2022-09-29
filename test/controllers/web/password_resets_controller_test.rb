require 'test_helper'

class Web::PasswordResetsControllerTest < ActionController::TestCase
  test 'should create token and send email' do
    user = create(:user)
    attrs = { email: user.email }

    assert_emails(1) { post :create, params: { password_reset_form: attrs } }
    assert_redirected_to root_path
  end

  test 'should update password' do
    user = create(:user)
    PasswordResetTokenBuilder.create_password_reset_token(user)

    patch :update, params: {
      new_password_form: {
        password: 123,
        password_confirmation: 123,
        reset_token: user.reset_token,
      },
    }

    assert_redirected_to new_session_path
  end

  test 'should not update password twice by one token' do
    user = create(:user)
    PasswordResetTokenBuilder.create_password_reset_token(user)

    patch :update, params: {
      new_password_form: {
        password: 123,
        password_confirmation: 123,
        reset_token: user.reset_token,
      },
    }

    assert_redirected_to new_session_path

    patch :update, params: {
      new_password_form: {
        password: 444,
        password_confirmation: 444,
        reset_token: user.reset_token,
      },
    }

    assert_redirected_to new_password_path
  end

  test 'should not update password if token has expired' do
    user = create(:user)
    PasswordResetTokenBuilder.create_password_reset_token(user)

    travel 25.hours

    patch :update, params: {
      new_password_form: {
        password: 123,
        password_confirmation: 123,
        reset_token: user.reset_token,
      },
    }

    assert_redirected_to new_password_path
  end
end
