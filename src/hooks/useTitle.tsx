import { useEffect } from 'react';
import { useTranslate } from 'react-admin';

/**
 * Set and translate the title of the page.
 * @param {string} title A string which will be set as the first part of the title. can be both a regular string
 *                       or a react-admin translateable string.
 * @param {boolean} shouldTranslate When set to false, the title will not be translated. Useful for when rendering
 *                                  the title outside the scope of the react-adminapp.
 * @param {string} appName A string which will be used as the second part of the title. can be both a regular string
 *                         or a react-admin translateable string;
 * @default shouldTranslate true
 * @default appName 'app.name'
 * @example
 * ```ts
 * const Profile = () => {
 *  useTranslate('app.profile.title'); // -> document.title == translate('app.profile.title') + ' | ' + translate('app.name')
 * }
 * ```
 */
const useTitle = (title: string, shouldTranslate: boolean = true, appName: string = 'app.name') => {
  const translate = useTranslate();

  useEffect(() => {
    if (!shouldTranslate) {
      document.title = title;
    } else {
      document.title = `${translate(title)} | ${translate(appName)}`;
    }

    return () => {
      if (shouldTranslate) {
        document.title = translate('app.name');
      }
    }
  }, [title, translate, shouldTranslate, appName]);
};

export default useTitle;