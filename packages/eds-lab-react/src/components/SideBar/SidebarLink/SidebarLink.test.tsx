import React from 'react'
import { render, screen, waitFor, RenderOptions } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { SidebarLink, SidebarLinkProps } from './index'
import { home } from '@equinor/eds-icons'
import userEvent from '@testing-library/user-event'
import { SideBar } from '../SideBar'

const defaultProps: SidebarLinkProps = {
  name: 'Home',
  currentUrl: 'http://localhost:3000/home',
  icon: home,
  link: 'home',
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => render(ui, { ...options })

function SideBarWrapper(children: React.ReactElement, isOpen?: boolean) {
  return <SideBar open={isOpen}>{children}</SideBar>
}

test('Renders', () => {
  customRender(<SidebarLink {...defaultProps}></SidebarLink>, {
    wrapper: ({ children }) => SideBarWrapper(children),
  })
})

test('Renders tooltip when closed', async () => {
  customRender(
    <SidebarLink
      data-testid="sidebar-menu-item"
      {...defaultProps}
    ></SidebarLink>,
    {
      wrapper: ({ children }) => SideBarWrapper(children),
    },
  )
  const link = screen.getByTestId('sidebar-menu-item')

  userEvent.hover(link)

  await screen.findByRole('tooltip')
  expect(screen.getByRole('tooltip')).toHaveTextContent('Home')
})

test('Does not render tooltip when open', async () => {
  customRender(
    <SidebarLink
      data-testid="sidebar-menu-item"
      {...defaultProps}
    ></SidebarLink>,
    {
      wrapper: ({ children }) => SideBarWrapper(children, true),
    },
  )
  const link = screen.getByTestId('sidebar-menu-item')

  userEvent.hover(link)

  await waitFor(() =>
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument(),
  )
})

test('Renders name when open', () => {
  customRender(<SidebarLink {...defaultProps}></SidebarLink>, {
    wrapper: ({ children }) => SideBarWrapper(children, true),
  })

  expect(screen.getByText('Home')).toHaveTextContent('Home')
})

test('Does not render name when closed', () => {
  customRender(<SidebarLink {...defaultProps}></SidebarLink>, {
    wrapper: ({ children }) => SideBarWrapper(children),
  })

  expect(screen.queryByText('Home')).not.toBeInTheDocument()
})