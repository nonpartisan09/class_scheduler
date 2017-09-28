module Contexts::Users::Errors
  class AlreadySignedIn < RuntimeError
  end

  class AlreadyUsedDisplayName < RuntimeError

  end

  class MultipleErrors < RuntimeError

  end

  class AlreadyUsedEmail < RuntimeError

  end

  class MustAgreeToTermsAndConditions < RuntimeError

  end

  class UnknownRegistrationError < RuntimeError

  end

  class UnknownSignInError < RuntimeError

  end

end
