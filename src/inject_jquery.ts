import log = require('./log');

export = enable_jquery;

const JQUERY_PATH = "lib/jquery.js";

interface JQueryWebPage extends WebPage {
    has_jquery?: boolean;
}

function enable_jquery(page: JQueryWebPage)
{
    if(!page.has_jquery) {
        log.debug("Adding handler to inject JQuery");
       page.has_jquery = true; 
       page.onLoadFinished = () => {
            log.debug("Injecting JQuery");
           page.injectJs(JQUERY_PATH);
       };
    }    
}