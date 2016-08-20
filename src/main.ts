require('any-promise/register/bluebird');
import {login_amazon } from './login';
import log = require('winston');

log.level = "silly";

log.info("Amazon Purchase Importer");
 
login_amazon();