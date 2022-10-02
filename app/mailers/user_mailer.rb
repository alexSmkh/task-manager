class UserMailer < ApplicationMailer
  def task_created
    user = params[:user]
    @task = params[:task]

    mail(from: 'noreply@taskmanager.com', to: user.email, subject: 'New Task Created')
  end

  def task_updated
    user = params[:user]
    @task = params[:task]

    mail(from: 'noreply@taskmanager.com', to: user.email, subject: 'Task Was Updated')
  end

  def task_deleted
    email = params[:email]
    @task_id = params[:task_id]
    mail(from: 'noreply@taskmanager.com', to: email, subject: 'Task Was Deleted')
  end

  def password_reset
    @user = params[:user]

    mail(from: 'noreply@taskmanager.com', to: @user.email, subject: 'Reset your password')
  end
end
