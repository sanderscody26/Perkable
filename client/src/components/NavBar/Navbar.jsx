import React, { useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { AppBar, Avatar, Toolbar, Typography, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import jwt_decode from 'jwt-decode'

import useStyles from './styles'

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  const logout = () => {
    dispatch({ type: 'LOGOUT' })

    history.push('/')

    setUser(null)
  }

  useEffect(() => {
    const token = user?.token

    if (token) {
      const decoded = jwt_decode(token)

      if (decoded.exp * 1000 < new Date().getTime()) logout()
    }

    return () => {
      setUser(JSON.parse(localStorage.getItem('profile')))
    }
  }, [location])

  return (
    <AppBar className={classes.appBar} position='static' color='inherit'>
      <div className={classes.brandContainer}>
        <Typography
          component={Link}
          to='/'
          className={classes.heading}
          variant='h2'
          align='center'>
          Games
        </Typography>
        {/* A game image will go here once made */}
        <img className={classes.image} src='' alt='Games' height='60' />
      </div>
      <Toolbar className={classes.toolbar}>
        {user?.profile ? (
          <div className={classes.profile}>
            <Avatar
              className={classes.purple}
              variant='rounded'
              alt={user?.profile.name}
              src={user?.profile.image}
              referrerPolicy='no-referrer'
            />
            <Typography className={classes.userName} variant='h6'>
              {user?.profile.name}
            </Typography>
            <Button
              variant='contained'
              className={classes.logout}
              color='secondary'
              onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to='/auth'
            variant='contained'
            color='primary'>
            Sign-in
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
