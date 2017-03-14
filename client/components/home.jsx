import React from 'react'
import {Translator} from '../utils/translate'

const t = new Translator("Home", "english")

const Home = () => <div>{t("test")}</div>

export default Home;