// Copyright 2017 Keybase, Inc. All rights reserved. Use of
// this source code is governed by the included BSD license.

package client

import (
	"fmt"

	"golang.org/x/net/context"

	"github.com/keybase/cli"
	"github.com/keybase/client/go/libcmdline"
	"github.com/keybase/client/go/libkb"
	keybase1 "github.com/keybase/client/go/protocol/keybase1"
)

type CmdAccountRecoverUsername struct {
	libkb.Contextified
	email string
	phone keybase1.PhoneNumber
}

func NewCmdAccountRecoverUsername(cl *libcmdline.CommandLine, g *libkb.GlobalContext) cli.Command {
	return cli.Command{
		Name:  "recover-username",
		Usage: "Recover username via email or sms.",
		Action: func(c *cli.Context) {
			cmd := NewCmdAccountRecoverUsernameRunner(g)
			cl.ChooseCommand(cmd, "recover-username", c)
		},
		Flags: []cli.Flag{
			cli.StringFlag{
				Name:  "email",
				Usage: "Email associated with the account.",
			},
			cli.StringFlag{
				Name:  "phone",
				Usage: "Phone number associated with the account including country code, e.g. +12344567890",
			},
		},
	}
}

func NewCmdAccountRecoverUsernameRunner(g *libkb.GlobalContext) *CmdAccountRecoverUsername {
	return &CmdAccountRecoverUsername{Contextified: libkb.NewContextified(g)}
}

func (c *CmdAccountRecoverUsername) ParseArgv(ctx *cli.Context) error {
	c.email = ctx.String("email")
	c.phone = keybase1.PhoneNumber(ctx.String("phone"))
	if len(c.email) == 0 && len(c.phone) == 0 {
		return fmt.Errorf("email or phone is required")
	}
	return nil
}

func (c *CmdAccountRecoverUsername) Run() error {
	cli, err := GetAccountClient(c.G())
	if err != nil {
		return err
	}
	return cli.RecoverUsername(context.Background(), keybase1.RecoverUsernameArg{
		Email: c.email,
		Phone: c.phone,
	})
}

func (c *CmdAccountRecoverUsername) GetUsage() libkb.Usage {
	return libkb.Usage{
		API:    true,
		Config: true,
	}
}
