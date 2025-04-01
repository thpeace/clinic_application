import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';

const { Footer } = Layout;

type FooterNavProps = React.HTMLAttributes<HTMLDivElement>;

const FooterNav = ({ ...others }: FooterNavProps) => {
  const { t } = useTranslation();
  return (
    <Footer {...others}>
      {' '}
      {t('clinicName')} © 2025 Created by Design Sparx
    </Footer>
  );
};

export default FooterNav;
