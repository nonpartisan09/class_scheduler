if Rails.env.staging? or Rails.env.production?
  Geocoder.configure(
      :lookup => :google,
      :use_https => true,
      :api_key =>  ENV['TUTORIA_GOOGLE_API_KEY']
  )
end
