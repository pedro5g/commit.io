#!/bin/bash
(node --import tsx --test $1 -- -w  packages/shared/**/__test__/*)
(node --import tsx --test $1 -- -w apps/services/**/__test__/*)