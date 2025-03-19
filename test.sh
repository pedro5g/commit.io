#!/bin/bash
(node --import tsx --test -- -w  packages/shared/**/__test__/*)
(node --import tsx --test -- -w apps/services/**/__test__/*)