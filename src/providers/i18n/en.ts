import { TranslationMessages } from 'react-admin';
import englishMessages from 'ra-language-english';

const customEnglishMessages: TranslationMessages = {
  ...englishMessages,
  or: 'OR',
  me: 'me',
  app: {
    name: 'Travel Budget App',
  },
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
    validation: {
      confirm_password: 'Passwords do not match',
    },
    reset_password_error:
      'An error occurred while resetting your password.\nPlease try again later.',
    reset_password_success: 'Password changed successfully!',
    account_delete_success: 'Account deleted successfully!',
  },
  profile: {
    title: 'Profile',
    page_title: 'Your Profile',
    picture_dialog_title: 'Edit or Delete Your Profile Picture',
    deleted_picture: 'Deleted profile picture successfully.',
    uploaded_picture: 'Uploaded profile picture successfully.',
    personal_data: {
      title: 'Personal Data',
      description: 'Edit or delete your personal data',
      fields: {
        first_name: {
          description:
            'This information will be displayed in all trips you shared, or have been shared with.',
        },
        last_name: {
          description:
            'This information will be displayed in all trips you shared, or have been shared with.',
        },
      },
    },
    account: {
      title: 'Account',
      description: 'Edit or delete you account information',
      fields: {
        can_be_shared: {
          description: 'Allow other users to share their trips with you.',
        },
        password: {
          description: 'Reset your password to a new password.',
        },
        confirmPassword: {
          description: 'Confirm the password to reset to.',
        },
      },
      delete: {
        title: 'Delete your account',
        content:
          'Are you sure you want to delete your account?\nThis action is ireversable.',
      },
    },
    errors: {
      could_not_delete_picture:
        'An error occurred while deleting your profile picture.\n Please try again later.',
      could_not_upload_picture:
        'An error occurred while uploading your profile picture.\n Please try again later.',
    },
  },
  trips: {
    page_title: 'Your Trips',
    shares: {
      errors: {
        user_not_found: 'User not found, or disabled his discoverability.',
        cant_share_yourself: 'You can not share a trip with yourself.',
      },
    },
  },
  resources: {
    profiles: {
      first_name: 'First Name',
      last_name: 'Last Name',
      email: 'Email',
      can_be_shared: 'Can Be Shared',
    },
    trips: {
      created_at: 'Created At',
      updated_at: 'Updated At',
      updated_by: 'Updated By',
      owner: 'Owner',
      trip_name: 'Name',
      shares: 'Select Emails',
    },
  },
  meta: {
    created_at: 'Created %{date} by %{name}',
    last_updated_at: 'Last updated %{date} by %{name}',
  },
};

export default customEnglishMessages;
