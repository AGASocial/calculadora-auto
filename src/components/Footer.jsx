const Footer = () => {
  return (
    <footer className="w-full py-4 px-4 border-t border-gray-700 mt-8">
      <div className="flex flex-col items-center justify-center text-gray-400 text-sm space-y-2">
        <div className="flex items-center gap-1">
          Creado por{' '}
          <a
            href="https://www.instagram.com/marcostv.oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            @marcostv.oficial
          </a>
        </div>
        <div>
          Sitio web desarrollado por{' '} 
          <a
            href="https://aga.social"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            aga.social
          </a>
        </div>
        <div className="text-gray-500">Versión 1.0.2</div>
      </div>
    </footer>
  );
};

export default Footer;
