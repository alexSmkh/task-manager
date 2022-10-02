class SendTaskDestroyNotificationJob < ApplicationJob
  sidekiq_options queue: :mailers
  sidekiq_throttle_as :mailer

  def perform(email, task_id)
    UserMailer.with(email: email, task_id: task_id).task_deleted.deliver_now
  end
end
