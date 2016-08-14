import { create as WebPage } from 'webpage';
import {login_amazon }from './login';

let page = WebPage();

login_amazon(page);