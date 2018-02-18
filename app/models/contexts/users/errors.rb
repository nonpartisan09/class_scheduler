module Contexts::Users::Errors
  class AlreadySignedIn < RuntimeError
  end

  class AlreadyUsedEmailAlreadyUsedDisplayName < RuntimeError

  end

  class AlreadyUsedDisplayName < RuntimeError

  end

  class AlreadyUsedEmail < RuntimeError

  end

  class UnknownRegistrationError < RuntimeError

  end

  class UnknownSignInError < RuntimeError

  end

  class AcceptTermsAndConditions < RuntimeError

  end
end
