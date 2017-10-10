RSpec.configure do |config|
  # additional factory_girl configuration
  config.include FactoryGirl::Syntax::Methods

  config.before(:suite) do
   begin
    DatabaseCleaner.start
    ensure
      DatabaseCleaner.clean
   end
  end
end
