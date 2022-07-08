lint: 
	bundle exec rubocop .

format:
	bundle exec rubocop -A

run:
	docker compose up

migrate:
	docker compose run --rm web bash -c 'rake db:migrate'