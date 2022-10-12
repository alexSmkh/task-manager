class SendPasswordResetInstructionsJob < ApplicationJob
  sidekiq_options queue: :mailers
  sidekiq_throttle_as :mailer

  def perform(email, token)
    UserMailer.with(email: email, token: token).password_reset.deliver_now
  end
end