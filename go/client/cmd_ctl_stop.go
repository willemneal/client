// Copyright 2015 Keybase, Inc. All rights reserved. Use of
// this source code is governed by the included BSD license.

// +build !darwin,!windows

package client

import (
	"github.com/keybase/cli"
	"github.com/keybase/client/go/libcmdline"
	"github.com/keybase/client/go/libkb"
)

func NewCmdCtlStop(cl *libcmdline.CommandLine, g *libkb.GlobalContext) cli.Command {
	return cli.Command{
		Name:  "stop",
		Usage: "Stop the background keybase service",
		Flags: []cli.Flag{
			cli.BoolFlag{
				Name:  "shutdown",
				Usage: "A no-op flag for linux, since that is the default behavior; the service will just shutdown",
			},
			cli.BoolFlag{
				Name:  "all",
				Usage: "Shut down the GUI, KBFS, and the redirector as well",
			},
		},
		Action: func(c *cli.Context) {
			cl.ChooseCommand(newCmdCtlStop(g), "stop", c)
			cl.SetForkCmd(libcmdline.NoFork)
			cl.SetNoStandalone()
		},
	}
}

func newCmdCtlStop(g *libkb.GlobalContext) *CmdCtlStop {
	return &CmdCtlStop{
		Contextified: libkb.NewContextified(g),
	}
}

type CmdCtlStop struct {
	libkb.Contextified
	all bool
}

func (s *CmdCtlStop) ParseArgv(ctx *cli.Context) error {
	s.all = ctx.Bool("all")
	return nil
}

func (s *CmdCtlStop) Run() (err error) {
	if s.all {
		return CtlServiceStopAll(s.G())
	} else {
		return CtlServiceStop(s.G())
	}
}

func (s *CmdCtlStop) GetUsage() libkb.Usage {
	return libkb.Usage{}
}
