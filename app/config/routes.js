import React from 'react'
import Main from '../components/Main'
import MainNavContainer from '../components/MainNav'
import Home from '../components/Home'
import PriceEntry from '../components/Price/PriceEntry'
import { Route, IndexRoute } from 'react-router'

export default (
	<Route path="/" component={MainNavContainer}>
		<IndexRoute component={Main} />
		<Route path="main" component={Main} />
		<Route path="price" component={PriceEntry} />
	</Route>
)
