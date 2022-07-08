lint: 
	bundle exec rubocop .

format:
	bundle exec rubocop -A

run:
	docker compose up