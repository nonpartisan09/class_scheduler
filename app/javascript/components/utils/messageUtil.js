function isCurrentUserRecipient({ currentUrlSlug, recipientUrlSlug }) {
  return currentUrlSlug === recipientUrlSlug;
}

function determineRecipient({ currentUrlSlug, recipientUrlSlug, recipient, senderUrlSlug, sender }) {
  if (isCurrentUserRecipient({ currentUrlSlug, recipientUrlSlug })) {
    return {
      firstName: sender,
      urlSlug: senderUrlSlug
    };
  } else {
    return {
      firstName: recipient,
      urlSlug: recipientUrlSlug
    };
  }
}

export {
  determineRecipient,
  isCurrentUserRecipient
};
