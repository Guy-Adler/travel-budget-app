import { TranslationMessages } from 'react-admin';
import englishMessages from 'ra-language-english';

const customEnglishMessages: TranslationMessages = {
  ...englishMessages,
  auth: {
    email: 'Email',
    google: 'Sign in with google',
    forgot_password: 'Forgot Password?',
    send_password_reset: 'Send Password Reset?',
    send_reset_link: 'Send Reset Link',
    password_reset_alert_dialog_description:
      'A temporary login link will be sent to the following email:',
    reset_link_sent:
      'Login link sent successfully!\nAfter clicking the link, go to your profile to reset your password.',
  },
  or: 'OR',
  profile: {
    title: 'Profile',
    picture_dialog_title: 'Edit or Delete Your Profile Picture',
    errors: {
      could_not_delete_picture: 'An error occurred while deleting your profile picture.\n Please try again later.'
    }
  }
};

export default customEnglishMessages;
